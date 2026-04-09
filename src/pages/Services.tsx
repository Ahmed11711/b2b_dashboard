import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";
import { serviceApi } from "../services/serviceApi";
import { Service } from "../types";
import { formatCurrency } from "../lib/utils";
import { toast, Toaster } from "sonner";

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await serviceApi.getServices();
      setServices(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch services");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.service_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await serviceApi.deleteService(id);
        setServices(services.filter((s) => s.id !== id));
        toast.success("Service deleted successfully");
      } catch (error) {
        toast.error("Failed to delete service");
      }
    }
  };

  const handleSaveService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const serviceData = {
      service_name: formData.get("service_name") as string,
      price: Number(formData.get("price")),
      price_today: Number(formData.get("price_today")),
      discount: Number(formData.get("discount")),
      // نأخذ القيمة مباشرة كـ string من الـ textarea
      standard_bags: formData.get("standard_bags") as string,
    };

    try {
      if (editingService) {
        const res = await serviceApi.updateService(
          editingService.id,
          serviceData,
        );
        setServices(
          services.map((s) => (s.id === editingService.id ? res.data : s)),
        );
        toast.success("Service updated successfully");
      } else {
        const res = await serviceApi.createService(serviceData);
        setServices([res.data, ...services]);
        toast.success("Service created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save service");
    }
  };

  const columns = [
    {
      header: "Service Name",
      accessor: (s: Service) => (
        <div className="font-semibold text-carbon-black">{s.service_name}</div>
      ),
    },
    { header: "Base Price", accessor: (s: Service) => formatCurrency(s.price) },
    {
      header: "Price Today",
      accessor: (s: Service) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-carbon-black">
            {formatCurrency(s.price_today)}
          </span>
          {Number(s.discount) > 0 && (
            <Badge variant="success">-{s.discount}%</Badge>
          )}
        </div>
      ),
    },
    {
      header: "Standard Bags",
      accessor: (s: Service) => (
        <div
          className="text-sm text-cool-gray max-w-[200px] truncate"
          title={s.standard_bags} // يظهر النص كاملاً عند الوقوف بالماوس
        >
          {s.standard_bags || "No description"}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (s: Service) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingService(s);
              setIsModalOpen(true);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(s.id)}
            className="text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-10">
      <Toaster position="top-right" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-carbon-black">Services</h1>
        <Button
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
          className="btn-emerald"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredServices}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Service" : "Add New Service"}
      >
        <form className="p-6 space-y-6" onSubmit={handleSaveService}>
          <div className="space-y-5">
            <Input
              label="Service Name"
              name="service_name"
              defaultValue={editingService?.service_name}
              required
            />

            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Base Price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingService?.price}
                required
              />
              <Input
                label="Discount (%)"
                name="discount"
                type="number"
                defaultValue={editingService?.discount || 0}
              />
            </div>

            <Input
              label="Price Today"
              name="price_today"
              type="number"
              step="0.01"
              defaultValue={editingService?.price_today}
              required
            />

            {/* قسم الوصف كـ String */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-sm font-semibold text-carbon-black flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-400" />
                Standard Bags Description
              </label>
              <p className="text-xs text-slate-400">
                Write a description of what's included (e.g., 5kg bag, dry clean
                only).
              </p>
              <textarea
                name="standard_bags"
                defaultValue={editingService?.standard_bags}
                placeholder="Enter details here..."
                rows={4}
                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all border-slate-200 hover:border-slate-300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-emerald px-8">
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Services;
