import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  ClipboardList, 
  DollarSign, 
  Calendar,
  BarChart3,
  Clock,
  TrendingUp,
  Shield,
  Smartphone,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Target,
  Zap,
  Heart,
  Brain,
  Lightbulb
} from 'lucide-react';



export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState('dashboard');
  const navigate = useNavigate();

  const handleNavigateLogin = () => {
    navigate('/login');
  };

  const features = [
    {
      id: 'dashboard',
      icon: BarChart3,
      title: 'Dashboard Thông minh',
      description: 'Tổng quan toàn diện với thống kê realtime',
      benefits: ['Tiết kiệm 75% thời gian báo cáo', 'Insight dữ liệu tức thì', 'Multi-role dashboard'],
      image: '📊'
    },
    {
      id: 'students',
      icon: Users,
      title: 'Quản lý Học sinh',
      description: 'Hồ sơ 360° và theo dõi tiến độ chi tiết',
      benefits: ['Tracking tiến độ realtime', 'Liên lạc phụ huynh tự động', 'Analytics hiệu suất'],
      image: '👥'
    },
    {
      id: 'assignments',
      icon: ClipboardList,
      title: 'Bài tập Tương tác',
      description: 'Tạo và chấm bài tự động với AI',
      benefits: ['Giảm 70% thời gian chấm bài', 'Feedback chi tiết', 'Multi-format support'],
      image: '📝'
    },
    {
      id: 'fees',
      icon: DollarSign,
      title: 'Quản lý Học phí',
      description: 'Tự động hóa hóa đơn và thanh toán',
      benefits: ['99.5% accuracy', 'Multi-payment methods', 'Automated reminders'],
      image: '💰'
    },
    {
      id: 'schedule',
      icon: Calendar,
      title: 'Lịch học Thông minh',
      description: 'Quản lý lịch học và phòng học tối ưu',
      benefits: ['Conflict detection', 'Auto notifications', 'Resource optimization'],
      image: '📅'
    }
  ];

  const metrics = [
    { value: '75%', label: 'Giảm thời gian hành chính', icon: Clock, color: 'text-blue-600' },
    { value: '95%', label: 'Hài lòng phụ huynh', icon: Heart, color: 'text-green-600' },
    { value: '40%', label: 'Tăng hiệu quả quản lý', icon: TrendingUp , color: 'text-purple-600' },
    { value: '99.5%', label: 'Độ chính xác tài chính', icon: Target, color: 'text-orange-600' }
  ];

  const testimonials = [
    {
      name: 'Cô Linh',
      role: 'Giáo viên trưởng - Bright Future Center',
      content: 'DreamClass đã thay đổi hoàn toàn cách chúng tôi làm việc. Tôi có thể tập trung 90% thời gian cho giảng dạy thay vì làm giấy tờ.',
      avatar: '👩‍🏫',
      rating: 4,
    },
    {
      name: 'Chị Hương',
      role: 'Phụ huynh',
      content: 'Rất thích việc có thể theo dõi tiến độ của con 24/7. Thanh toán học phí online cũng rất tiện lợi.',
      avatar: '👩‍💼',
      rating: 5,
    },
  ];
  
  const useCases = [
    {
      scenario: 'Buổi sáng - Cô Linh',
      steps: [
        'Kiểm tra lịch dạy trên mobile',
        'Xem danh sách điểm danh nhanh',
        'Tạo bài tập mới trong 5 phút',
        'Gửi thông báo tới phụ huynh'
      ],
      time: '15 phút vs 45 phút trước đây',
      icon: '🌅'
    },
    {
      scenario: 'Buổi chiều - Bé An',
      steps: [
        'Đăng nhập với giao diện thân thiện',
        'Làm bài tập interactive',
        'Xem feedback từ cô giáo',
        'Check lịch học tuần tới'
      ],
      time: 'Trải nghiệm seamless',
      icon: '🌆'
    },
    {
      scenario: 'Buổi tối - Phụ huynh',
      steps: [
        'Xem tiến độ học tập của con',
        'Thanh toán học phí online',
        'Đọc báo cáo chi tiết',
        'Liên lạc với giáo viên'
      ],
      time: '10 phút vs 2 giờ trước đây',
      icon: '🌙'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* --- PHẦN THÊM MỚI: NAVBAR --- */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="w-6 h-6" />
            DreamClass
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Tính năng</a>
            <a href="#metrics" className="hover:text-blue-600 transition-colors">Hiệu quả</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Đánh giá</a>
          </div>

          <div className="flex gap-4">
            <Button variant="ghost" onClick={handleNavigateLogin} className="hidden sm:inline-flex">
              Đăng nhập
            </Button>
          </div>
        </div>
      </nav>
      {/* --- KẾT THÚC PHẦN NAVBAR --- */}
        
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DreamClass
                </h1>
                <p className="text-sm text-muted-foreground">Nơi ước mơ giáo dục trở thành hiện thực</p>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Hệ thống Quản lý 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Lớp học </span>
              Thông minh
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Giải pháp số hóa toàn diện cho trung tâm tiếng Anh, giúp <strong>giảm 75% thời gian hành chính</strong> 
              và <strong>tăng 40% hiệu quả quản lý</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {/* <Button size="lg" onClick={handleNavigateLogin} className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                Trải nghiệm Demo
              </Button> */}
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                <Globe className="w-5 h-5 mr-2" />
                Xem Case Study
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {metrics.map((metric, index) => (
              <Card key={index} className="text-center border-none shadow-lg bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <metric.icon className={`w-8 h-8 ${metric.color} mx-auto mb-3`} />
                  <div className="text-3xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Lightbulb className="w-4 h-4 mr-2" />
              Tính năng nổi bật
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Mọi thứ bạn cần trong <span className="text-blue-600">một nền tảng</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              DreamClass tích hợp đầy đủ các công cụ cần thiết để quản lý trung tâm giáo dục hiệu quả
            </p>
          </div>

          <Tabs value={activeFeature} onValueChange={setActiveFeature} className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-4xl mx-auto">
              {features.map((feature) => (
                <TabsTrigger key={feature.id} value={feature.id} className="text-sm">
                  <feature.icon className="w-4 h-4 mr-2" />
                  {feature.title.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {features.map((feature) => (
              <TabsContent key={feature.id} value={feature.id}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <feature.icon className="w-8 h-8 text-blue-600" />
                      <h4 className="text-2xl font-bold">{feature.title}</h4>
                    </div>
                    <p className="text-lg text-muted-foreground mb-6">
                      {feature.description}
                    </p>
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-9xl mb-4">{feature.image}</div>
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                      <CardContent className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          Live Demo Available
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Trải nghiệm ngay tính năng này
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Ứng dụng thực tế
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Một ngày với <span className="text-purple-600">DreamClass</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Xem cách DreamClass tối ưu hóa quy trình làm việc hàng ngày của các bên liên quan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-none bg-white/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{useCase.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{useCase.scenario}</CardTitle>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Clock className="w-3 h-3 mr-1" />
                        {useCase.time}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {useCase.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                          {stepIndex + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              Khách hàng nói gì
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Được tin tưởng bởi nhiều phụ huynh và giáo viên
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Xem mọi người nói gì về DreamClass
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-none bg-white/90 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng chuyển đổi số?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Tham gia cùng 500+ trung tâm giáo dục đã tin tưởng DreamClass
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" onClick={handleNavigateLogin} className="text-lg px-8 py-4">
              <Zap className="w-5 h-5 mr-2" />
              Bắt đầu Demo miễn phí
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
              <Shield className="w-5 h-5 mr-2" />
              Tư vấn 1-1
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Setup trong 1 tuần
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Hỗ trợ 24/7
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Đào tạo miễn phí
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              ROI guarantee
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}