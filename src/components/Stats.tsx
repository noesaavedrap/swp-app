import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";

export default function Stats() {
  return (
    <section className="bg-white py-10 md:py-14 lg:py-20">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-[420px]">
            <h2 className="text-[28px] md:text-[36px] font-light text-text-primary leading-tight -tracking-[0.6px]">
              La plataforma financiera usada por medio millón de empresas en Latinoamérica.
            </h2>
            <p className="mt-4 text-md font-light text-text-secondary">
              Confianza y escala para tu negocio con la infraestructura financiera líder de la región.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            <div>
              <p className="text-[40px] md:text-[48px] font-light text-text-primary -tracking-[0.96px] leading-none">
                +<SlidingNumber number={500} fromNumber={0} />M
              </p>
              <p className="mt-2 text-sm font-light text-text-secondary">
                Dólares procesados anualmente
              </p>
            </div>

            <div>
              <p className="text-[40px] md:text-[48px] font-light text-text-primary -tracking-[0.96px] leading-none">
                <SlidingNumber number={99.99} fromNumber={0} decimalPlaces={2} />
                %
              </p>
              <p className="mt-2 text-sm font-light text-text-secondary">
                Disponibilidad garantizada
              </p>
            </div>

            <div>
              <p className="text-[40px] md:text-[48px] font-light text-text-primary -tracking-[0.96px] leading-none">
                24/7
              </p>
              <p className="mt-2 text-sm font-light text-text-secondary">
                Soporte empresarial
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
