import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';

interface CompletedWork {
  id: string;
  bookingId: string;
  service: string;
  customerName: string;
  completedDate: string;
  rating: number;
  usedComponents: boolean;
  componentDetails?: string;
  warrantyMonths?: number;
  completionImage: string;
}

interface WorkerStats {
  totalCompleted: number;
  averageRating: number;
  totalEarnings: number;
  thisMonthCompleted: number;
}

export default function Profile() {
  const navigate = useNavigate();
  
  // Get worker data from localStorage
  const getWorkerData = () => {
    const workerStr = localStorage.getItem('worker');
    if (workerStr) {
      const worker = JSON.parse(workerStr);
      return { id: worker.id, name: worker.name };
    }
    return { id: 'WKR001', name: 'Worker' };
  };
  
  const workerData = getWorkerData();
  const [workerName] = useState(workerData.name);
  const [workerId] = useState(workerData.id);
  
  // Mock data - replace with API calls
  const [stats] = useState<WorkerStats>({
    totalCompleted: 47,
    averageRating: 4.6,
    totalEarnings: 23500,
    thisMonthCompleted: 8,
  });

  const [completedWorks] = useState<CompletedWork[]>([
    {
      id: '1',
      bookingId: 'BK045',
      service: 'Laptop Screen Replacement',
      customerName: 'John Doe',
      completedDate: '2026-01-09',
      rating: 5,
      usedComponents: true,
      componentDetails: 'LCD Screen, Hinges',
      warrantyMonths: 12,
      completionImage: '/placeholder-work.jpg',
    },
    {
      id: '2',
      bookingId: 'BK043',
      service: 'PC Hardware Upgrade',
      customerName: 'Jane Smith',
      completedDate: '2026-01-08',
      rating: 4,
      usedComponents: false,
      completionImage: '/placeholder-work.jpg',
    },
    {
      id: '3',
      bookingId: 'BK040',
      service: 'Laptop Battery Replacement',
      customerName: 'Mike Johnson',
      completedDate: '2026-01-07',
      rating: 5,
      usedComponents: true,
      componentDetails: 'Li-ion Battery',
      warrantyMonths: 6,
      completionImage: '/placeholder-work.jpg',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Worker Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="ghost" onClick={() => {
              localStorage.removeItem('worker');
              navigate('/login');
            }}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-2xl">
                  {workerName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{workerName}</h2>
                <p className="text-muted-foreground">Worker ID: {workerId}</p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <Badge variant="secondary">
                    ⭐ {stats.averageRating} Rating
                  </Badge>
                  <Badge variant="secondary">
                    ✓ {stats.totalCompleted} Jobs Completed
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Completed</CardDescription>
              <CardTitle className="text-3xl">{stats.totalCompleted}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Rating</CardDescription>
              <CardTitle className="text-3xl">{stats.averageRating} ⭐</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Earnings</CardDescription>
              <CardTitle className="text-3xl">₹{stats.totalEarnings}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">{stats.thisMonthCompleted}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Work History */}
        <Card>
          <CardHeader>
            <CardTitle>Work History</CardTitle>
            <CardDescription>View all your completed jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Works</TabsTrigger>
                <TabsTrigger value="with-warranty">With Warranty</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {completedWorks.map((work) => (
                  <Card key={work.id}>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-[1fr_2fr] gap-4">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={work.completionImage} 
                            alt="Completed work"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{work.service}</h3>
                              <p className="text-sm text-muted-foreground">
                                Booking #{work.bookingId}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {'⭐'.repeat(work.rating)}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p><strong>Customer:</strong> {work.customerName}</p>
                            <p><strong>Completed:</strong> {new Date(work.completedDate).toLocaleDateString()}</p>
                            {work.usedComponents && (
                              <>
                                <p><strong>Components Used:</strong> {work.componentDetails}</p>
                                <p><strong>Warranty:</strong> {work.warrantyMonths} months</p>
                                <Badge variant="secondary" className="mt-2">
                                  Under Warranty
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="with-warranty" className="space-y-4">
                {completedWorks.filter(w => w.usedComponents).map((work) => (
                  <Card key={work.id}>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-[1fr_2fr] gap-4">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={work.completionImage} 
                            alt="Completed work"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{work.service}</h3>
                          <div className="space-y-1 text-sm mt-2">
                            <p><strong>Booking:</strong> #{work.bookingId}</p>
                            <p><strong>Customer:</strong> {work.customerName}</p>
                            <p><strong>Components:</strong> {work.componentDetails}</p>
                            <p><strong>Warranty:</strong> {work.warrantyMonths} months</p>
                            <p><strong>Expires:</strong> {
                              new Date(
                                new Date(work.completedDate).setMonth(
                                  new Date(work.completedDate).getMonth() + (work.warrantyMonths || 0)
                                )
                              ).toLocaleDateString()
                            }</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
