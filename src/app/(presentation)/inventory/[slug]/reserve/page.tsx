import { MultiStepFormSchema } from "@/app/_schemas/form.schema";
import { SelectDate } from "@/components/reserve/select-date";
import { SubmitDetails } from "@/components/reserve/submit-details";
import { Welcome } from "@/components/reserve/welcome";
import { MultiStepFormEnum, PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

//A simple mapping from the step number to a React component. So if step === 0, it renders <Welcome />.
const MAP_STEP_TO_COMPONENT = {
  [MultiStepFormEnum.WELCOME]: Welcome,
  [MultiStepFormEnum.SELECT_DATE]: SelectDate,
  [MultiStepFormEnum.SUBMIT_DETAILS]: SubmitDetails,
};

export default async function ReservePage(props: PageProps) {
  const params = await props?.params;
  const searchParams = await props?.searchParams;
  const slug = decodeURIComponent(params?.slug as string);
  const step = searchParams?.step;

  const { data, success, error } = MultiStepFormSchema.safeParse({
    slug,
    step: Number(step),
  });

  if (!success) {
    console.log(error);
    notFound();
  }

  const classified = await prisma.classified.findUnique({
    where: { slug: data.slug },
    include: { make: true },
  });

  if (!classified) notFound();

  const Component = MAP_STEP_TO_COMPONENT[data.step]; // dynamically change the jsx component to render base on the step we got from the searchParams.

  return (
    <Component
      searchParams={searchParams}
      params={params}
      classified={classified}
    />
  );
}
