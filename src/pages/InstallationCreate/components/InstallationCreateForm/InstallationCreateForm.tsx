import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResponseError } from "@/models/responseError.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/stores/auth.store";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "@/constants/routes";
import { createInstallationSchema } from "@/schemas/installations.schema";
import InstallationCreateImageDropzone from "./components/InstallationCreateImageDropzone";
import { createInstallation } from "@/services/installations.service";

function InstallationCreateForm() {
  const navigate = useNavigate();
  const token = useAuth((state) => state.token);

  const form = useForm<z.infer<typeof createInstallationSchema>>({
    resolver: zodResolver(createInstallationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createInstallationSchema>) => {
    try {
      const respose = await createInstallation(values, token!);
      toast.success(respose);
      navigate(PRIVATE_ROUTES.INSTALLATIONS);
    } catch (error) {
      if (error instanceof ResponseError) return toast.error(error.message);
      toast.error("Ha ocurrido un error inesperado");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-background w-full p-8 rounded-lg"
      >
        <InstallationCreateImageDropzone form={form} />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Cancha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting && (
              <LoaderCircle size={16} className="animate-spin mr-2" />
            )}
            Crear Instalación
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default InstallationCreateForm;
