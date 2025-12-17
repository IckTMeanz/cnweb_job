import React, { useEffect, useState } from 'react';
import Navbar from './share/Navbar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOP_API_END_POINT } from './utils/constant';
import { setSingleJob } from '../components/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from './ui/toast';
import { Loader2, MapPin, Briefcase, DollarSign, Users, Calendar, Building2, Clock, Award } from 'lucide-react';

const JobDescription = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const jobId = params.id;
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const { singleJob } = useSelector(store => store.job);
    const initIsApplied = singleJob?.applications?.some(item => item.applicant === user?._id);
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOP_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setIsApplied(initIsApplied);
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.error("Error fetching job data:", error);
            }
        };
        fetchAllJobs();
    }, [jobId, user?._id]);

    const dateString = singleJob?.createdAt;
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const formattedDate = `Ngày ${day} tháng ${month} năm ${year}`;

    const handleApplyJob = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                toast({
                    title: res.data.message,
                    status: "success",
                    action: (
                        <ToastAction altText="OK">
                            OK
                        </ToastAction>
                    ),
                });
            }
        } catch (error) {
            console.error("Error applying for job:", error);
            toast({
                title: "Error applying for job",
                status: "error",
            });
        } finally {
            setLoading(false)
            setIsApplied(true)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar />

            <div className='max-w-6xl mx-auto px-4 py-8'>
                {/* Header Card */}
                <div className='bg-white rounded-2xl shadow-xl overflow-hidden mb-6'>
                    {/* Company Banner */}
                    <div className='h-32 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600'></div>

                    {/* Company Logo & Info */}
                    <div className='relative px-8 pb-6'>
                        <div className='flex items-start justify-between -mt-16'>
                            <div className='flex items-end gap-6'>
                                {/* Company Logo */}
                                <div className='w-32 h-32 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center overflow-hidden'>
                                    {singleJob?.company?.logo ? (
                                        <img
                                            src={singleJob.company.logo}
                                            alt={singleJob?.company?.name}
                                            className='w-full h-full object-contain p-2'
                                        />
                                    ) : (
                                        <Building2 className='w-16 h-16 text-gray-400' />
                                    )}
                                </div>

                                <div className='mt-16'>
                                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>{singleJob?.title}</h1>
                                    <p className='text-lg text-gray-600 flex items-center gap-2'>
                                        <Building2 className='w-5 h-5' />
                                        {singleJob?.company?.name}
                                    </p>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <div className='mt-16'>
                                {loading ? (
                                    <Button className='px-8 py-6 text-lg rounded-xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' disabled>
                                        <Loader2 className='animate-spin mr-2' />
                                        Đang xử lý...
                                    </Button>
                                ) : (
                                    <Button
                                        disabled={isApplied}
                                        className={`px-8 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 ${isApplied
                                                ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:scale-105'
                                            }`}
                                        onClick={isApplied ? () => { } : handleApplyJob}
                                    >
                                        {isApplied ? '✓ Đã nộp đơn' : 'Nộp đơn ngay'}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Quick Info Badges */}
                        <div className='flex flex-wrap items-center gap-3 mt-6'>
                            <Badge className='px-4 py-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 border-0'>
                                <Briefcase className='w-4 h-4 mr-2' />
                                {singleJob?.position} vị trí
                            </Badge>
                            <Badge className='px-4 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 border-0'>
                                <DollarSign className='w-4 h-4 mr-2' />
                                {singleJob?.salary} triệu VNĐ
                            </Badge>
                            <Badge className='px-4 py-2 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 border-0'>
                                <Clock className='w-4 h-4 mr-2' />
                                {singleJob?.jobType}
                            </Badge>
                            <Badge className='px-4 py-2 text-sm bg-orange-100 text-orange-700 hover:bg-orange-200 border-0'>
                                <MapPin className='w-4 h-4 mr-2' />
                                {singleJob?.location}
                            </Badge>
                            <Badge className='px-4 py-2 text-sm bg-pink-100 text-pink-700 hover:bg-pink-200 border-0'>
                                <Users className='w-4 h-4 mr-2' />
                                {singleJob?.applications?.length} ứng viên
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Left Column - Job Details */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Job Description Card */}
                        <div className='bg-white rounded-2xl shadow-lg p-8'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
                                <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                                    <Briefcase className='w-6 h-6 text-white' />
                                </div>
                                Mô tả công việc
                            </h2>
                            <p className='text-gray-700 leading-relaxed text-lg whitespace-pre-line'>
                                {singleJob?.description}
                            </p>
                        </div>

                        {/* Requirements Card */}
                        {singleJob?.requirements && singleJob.requirements.length > 0 && (
                            <div className='bg-white rounded-2xl shadow-lg p-8'>
                                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center'>
                                        <Award className='w-6 h-6 text-white' />
                                    </div>
                                    Yêu cầu công việc
                                </h2>
                                <ul className='space-y-3'>
                                    {singleJob.requirements.map((req, index) => (
                                        <li key={index} className='flex items-start gap-3 text-gray-700'>
                                            <span className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                                                <span className='text-green-600 text-sm'>✓</span>
                                            </span>
                                            <span className='text-lg'>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Job Info Sidebar */}
                    <div className='space-y-6'>
                        {/* Company Info Card */}
                        <div className='bg-white rounded-2xl shadow-lg p-6 sticky top-4'>
                            <h3 className='text-xl font-bold text-gray-900 mb-4'>Thông tin chi tiết</h3>
                            <div className='space-y-4'>
                                <div className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                                    <Building2 className='w-5 h-5 text-blue-600 mt-1 flex-shrink-0' />
                                    <div>
                                        <p className='text-sm text-gray-500'>Công ty</p>
                                        <p className='font-semibold text-gray-900'>{singleJob?.company?.name}</p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                                    <MapPin className='w-5 h-5 text-green-600 mt-1 flex-shrink-0' />
                                    <div>
                                        <p className='text-sm text-gray-500'>Địa điểm</p>
                                        <p className='font-semibold text-gray-900'>{singleJob?.location}</p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                                    <DollarSign className='w-5 h-5 text-purple-600 mt-1 flex-shrink-0' />
                                    <div>
                                        <p className='text-sm text-gray-500'>Mức lương</p>
                                        <p className='font-semibold text-gray-900'>{singleJob?.salary} triệu VNĐ</p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                                    <Award className='w-5 h-5 text-orange-600 mt-1 flex-shrink-0' />
                                    <div>
                                        <p className='text-sm text-gray-500'>Kinh nghiệm</p>
                                        <p className='font-semibold text-gray-900'>{singleJob?.experienceLevel} năm</p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                                    <Users className='w-5 h-5 text-pink-600 mt-1 flex-shrink-0' />
                                    <div>
                                        <p className='text-sm text-gray-500'>Số lượng ứng viên</p>
                                        <p className='font-semibold text-gray-900'>{singleJob?.applications?.length} người</p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                                    <Calendar className='w-5 h-5 text-red-600 mt-1 flex-shrink-0' />
                                    <div>
                                        <p className='text-sm text-gray-500'>Ngày đăng</p>
                                        <p className='font-semibold text-gray-900'>{formattedDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDescription;