import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import api from "@/context/AuthContext";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, ToggleRight, ToggleLeft } from "lucide-react";

interface Location {
  _id: string;
  name: string;
  displayName: string;
  state: string;
  latitude?: number;
  longitude?: number;
  region: string;
  tier: string;
  isActive: boolean;
  popularity: number;
}

export default function AdminLocations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    state: "",
    latitude: "",
    longitude: "",
    region: "Central",
    tier: "Tier1",
  });

  // Check if user is authorized (optional: add role check)
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadLocations();
  }, [user, navigate]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/locations/all?limit=1000");
      if (response.data.success) {
        setLocations(response.data.locations);
      }
    } catch (error) {
      toast.error("Failed to load locations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.displayName || !formData.state) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        // Update location
        const response = await api.put(`/locations/${editingId}`, {
          displayName: formData.displayName,
          state: formData.state,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          region: formData.region,
          tier: formData.tier,
        });

        if (response.data.success) {
          toast.success("Location updated successfully");
          setLocations(locations.map((l) => (l._id === editingId ? response.data.location : l)));
        }
      } else {
        // Create new location
        const response = await api.post("/locations", {
          name: formData.name.toLowerCase().trim(),
          displayName: formData.displayName,
          state: formData.state,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          region: formData.region,
          tier: formData.tier,
        });

        if (response.data.success) {
          toast.success("Location created successfully");
          setLocations([...locations, response.data.location]);
        }
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed";
      toast.error(message);
    }
  };

  const handleEdit = (location: Location) => {
    setFormData({
      name: location.name,
      displayName: location.displayName,
      state: location.state,
      latitude: location.latitude?.toString() || "",
      longitude: location.longitude?.toString() || "",
      region: location.region,
      tier: location.tier,
    });
    setEditingId(location._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this location?")) {
      return;
    }

    try {
      const response = await api.delete(`/locations/${id}`);
      if (response.data.success) {
        toast.success("Location deleted");
        setLocations(locations.filter((l) => l._id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete location");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const response = await api.patch(`/locations/${id}/toggle`);
      if (response.data.success) {
        toast.success(response.data.message);
        setLocations(
          locations.map((l) => (l._id === id ? response.data.location : l))
        );
      }
    } catch (error) {
      toast.error("Failed to toggle location");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      displayName: "",
      state: "",
      latitude: "",
      longitude: "",
      region: "Central",
      tier: "Tier1",
    });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Locations</h1>
          <p className="text-gray-600">Add, edit, and manage location data</p>
        </div>

        {/* Form Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {editingId ? "Edit Location" : "Add New Location"}
              </CardTitle>
              {showForm && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardHeader>

          {showForm && (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Location Name (Unique) *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!!editingId}
                      placeholder="e.g., mumbai"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData({ ...formData, displayName: e.target.value })
                      }
                      placeholder="e.g., Mumbai"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      placeholder="e.g., Maharashtra"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tier">Tier</Label>
                    <Select
                      value={formData.tier}
                      onValueChange={(value) =>
                        setFormData({ ...formData, tier: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Metro">Metro</SelectItem>
                        <SelectItem value="Tier1">Tier 1</SelectItem>
                        <SelectItem value="Tier2">Tier 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) =>
                        setFormData({ ...formData, region: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North">North</SelectItem>
                        <SelectItem value="South">South</SelectItem>
                        <SelectItem value="East">East</SelectItem>
                        <SelectItem value="West">West</SelectItem>
                        <SelectItem value="Northeast">Northeast</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
                      }
                      placeholder="e.g., 19.0760"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.0001"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: e.target.value })
                      }
                      placeholder="e.g., 72.8777"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Update Location" : "Add Location"}
                </Button>
              </form>
            </CardContent>
          )}

          {!showForm && (
            <CardContent>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Location
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Locations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Locations ({locations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">State</th>
                    <th className="text-left py-3 px-4 font-semibold">Tier</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Region
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Popularity
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr
                      key={location._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{location.displayName}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{location.state}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            location.tier === "Metro" ? "default" : "secondary"
                          }
                        >
                          {location.tier}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{location.region}</td>
                      <td className="py-3 px-4">{location.popularity}</td>
                      <td className="py-3 px-4">
                        <Badge variant={location.isActive ? "default" : "destructive"}>
                          {location.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggle(location._id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title={
                              location.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {location.isActive ? (
                              <ToggleRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(location)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(location._id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
