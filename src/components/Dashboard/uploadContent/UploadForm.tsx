"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Form, FormInput, FormLabel, FormError, FormSubmit, FormGroup } from '@/components/Forms'


type Locale = "es" | "en";

type FormData = {
  type: "illustration" | "picture";

  image: FileList;

  translations: {
    es: {
      title: string;
      description: string;
    };
    en: {
      title: string;
      description: string;
    };
  };
};


export default function CreateIllustrationPage() {
  const [locale, setLocale] = useState<Locale>("es");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      type: "illustration",
      translations: {
        es: {
          title: "",
          description: "",
        },
        en: {
          title: "",
          description: "",
        },
      },
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <FormLabel>Tipo</FormLabel>

        <select {...register("type")} className="formInput">
          <option value="illustration">Ilustración</option>
          <option value="picture">Fotografía</option>
        </select>
      </FormGroup>

      <FormGroup>
        <FormLabel>Imagen</FormLabel>

        <FormInput
          type="file"
          accept="image/*"
          {...register("image")}
        />
      </FormGroup>

      <div className="languageTabs">
        <button
          type="button"
          className={locale === "es" ? "active" : ""}
          onClick={() => setLocale("es")}
        >
          🇪🇸 Español
        </button>

        <button
          type="button"
          className={locale === "en" ? "active" : ""}
          onClick={() => setLocale("en")}
        >
          🇬🇧 English
        </button>
      </div>

      <FormGroup>
        <FormLabel>
          titulo
        </FormLabel>

        <FormInput
          {...register(`translations.${locale}.title`, {
            required: true,
          })}
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>
          descripcion

        </FormLabel>

        <textarea
          className="formTextarea"
          {...register(`translations.${locale}.description`, {
            required: true,
          })}
        />
      </FormGroup>

      <FormSubmit value="Guardar" />
    </Form>
  );
}