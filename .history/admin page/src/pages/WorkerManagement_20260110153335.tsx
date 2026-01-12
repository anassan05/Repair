import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Edit, Trash2, UserCheck, UserX, Save, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Worker {
  id: string;
  workerId: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  joinedDate: string;
  active: boolean;
  rating: number;
}

const WorkerManagement = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState({
    workerId: "",
    password: "",
    name: "",
    phone: "",
    email: "",
    location: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = () => {
    const storedWorkers = JSON.parse(localStorage.getItem('workers') || '[]');
    setWorkers(storedWorkers);
  };

  const saveWorkers = (updatedWorkers: Worker[]) => {
    localStorage.setItem('workers', JSON.stringify(updatedWorkers));
    setWorkers(updatedWorkers);
  };

  const handleAddWorker = () => {
    if (!formData.workerId || !formData.password || !formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if worker ID already exists
    if (workers.some(w => w.workerId === formData.workerId)) {
      toast({
        title: "Error",
        description: "Worker ID already exists",
        variant: "destructive",
      });
      return;
    }

    const newWorker: Worker = {
      id: Date.now().toString(),
      ...formData,
      joinedDate: new Date().toISOString(),
      active: true,
      rating: 5.0,
    };

    const updatedWorkers = [...workers, newWorker];
    saveWorkers(updatedWorkers);

    toast({
      title: "Success",
      description: `Worker ${formData.name} added successfully`,
    });

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditWorker = () => {
    if (!selectedWorker) return;

    const updatedWorkers = workers.map((w) =>
      w.id === selectedWorker.id
        ? { ...w, ...formData }
        : w
    );

    saveWorkers(updatedWorkers);

    toast({
      title: "Success",
      description: `Worker ${formData.name} updated successfully`,
    });

    setIsEditDialogOpen(false);
    setSelectedWorker(null);
    resetForm();
  };

  const handleDeleteWorker = () => {
    if (!selectedWorker) return;

    const updatedWorkers = workers.filter((w) => w.id !== selectedWorker.id);
    saveWorkers(updatedWorkers);

    toast({
      title: "Success",
      description: `Worker ${selectedWorker.name} deleted successfully`,
    });

    setIsDeleteDialogOpen(false);
    setSelectedWorker(null);
  };

  const toggleWorkerStatus = (worker: Worker) => {
    const updatedWorkers = workers.map((w) =>
      w.id === worker.id ? { ...w, active: !w.active } : w
    );
    saveWorkers(updatedWorkers);

    toast({
      title: "Success",
      description: `Worker ${worker.name} ${!worker.active ? 'activated' : 'deactivated'}`,
    });
  };

  const openEditDialog = (worker: Worker) => {
    setSelectedWorker(worker);
    setFormData({
      workerId: worker.workerId,
      password: worker.password,
      name: worker.name,
      phone: worker.phone,
      email: worker.email,
      location: worker.location,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      workerId: "",
      password: "",
      name: "",
      phone: "",
      email: "",
      location: "",
    });
  };

  const activeWorkers = workers.filter((w) => w.active).length;
  const inactiveWorkers = workers.filter((w) => !w.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Worker Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your repair technicians
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Worker
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Workers</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveWorkers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Workers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Workers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Worker ID</th>
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Phone</th>
                  <th className="text-left p-3 font-semibold">Location</th>
                  <th className="text-left p-3 font-semibold">Rating</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No workers found. Add your first worker to get started.
                    </td>
                  </tr>
                ) : (
                  workers.map((worker) => (
                    <tr key={worker.id} className="border-b hover:bg-accent/50">
                      <td className="p-3 font-mono text-sm">{worker.workerId}</td>
                      <td className="p-3">{worker.name}</td>
                      <td className="p-3">{worker.phone}</td>
                      <td className="p-3">{worker.location}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-yellow-500 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {worker.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleWorkerStatus(worker)}
                        >
                          {worker.active ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-500/10 text-red-600">
                              Inactive
                            </Badge>
                          )}
                        </Button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(worker)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(worker)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Worker Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
            <DialogDescription>
              Add a new technician to your team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workerId">Worker ID *</Label>
              <Input
                id="workerId"
                placeholder="e.g., TF001"
                value={formData.workerId}
                onChange={(e) =>
                  setFormData({ ...formData, workerId: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddWorker}>
              <Save className="w-4 h-4 mr-2" />
              Add Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Worker Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Worker</DialogTitle>
            <DialogDescription>
              Update worker information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-workerId">Worker ID</Label>
              <Input
                id="edit-workerId"
                value={formData.workerId}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedWorker(null);
                resetForm();
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleEditWorker}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the worker{" "}
              <strong>{selectedWorker?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorker} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkerManagement;
