"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createTreatmentPlan } from "@/lib/actions/admin-consultation-actions";
import { Plus, Trash2 } from "lucide-react";

interface TreatmentItem {
  treatment: string;
  price: number;
}

interface TreatmentPlanFormProps {
  consultationId: string;
  clinics: Array<{ id: string; name: string; city: string }>;
  onSuccess?: () => void;
}

export function TreatmentPlanForm({
  consultationId,
  clinics,
  onSuccess,
}: TreatmentPlanFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clinicId, setClinicId] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<TreatmentItem[]>([
    { treatment: "", price: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { treatment: "", price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof TreatmentItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clinicId) {
      toast({
        title: "Error",
        description: "Please select a clinic",
        variant: "destructive",
      });
      return;
    }

    const validItems = items.filter((item) => item.treatment && item.price > 0);
    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one treatment with price",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const result = await createTreatmentPlan(consultationId, {
      clinicId,
      items: validItems,
      notes,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success",
        description: "Treatment plan created successfully",
      });
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create treatment plan",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="clinic">Clinic *</Label>
        <Select value={clinicId} onValueChange={setClinicId}>
          <SelectTrigger id="clinic">
            <SelectValue placeholder="Select a clinic" />
          </SelectTrigger>
          <SelectContent>
            {clinics.map((clinic) => (
              <SelectItem key={clinic.id} value={clinic.id}>
                {clinic.name} - {clinic.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Treatments *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Treatment
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Treatment name (e.g., Dental Implant)"
                value={item.treatment}
                onChange={(e) => updateItem(index, "treatment", e.target.value)}
              />
            </div>
            <div className="w-32">
              <Input
                type="number"
                placeholder="Price (USD)"
                value={item.price || ""}
                onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Total Price</Label>
        <div className="text-2xl font-bold">${totalPrice.toFixed(2)} USD</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes for the patient..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Treatment Plan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
