import Banner from "../components/Banner";
export default function RegisterLayout({children}:{children: React.ReactNode}){
    const pageName = "Register";
    const pageDescription = "Register your child for thes waitlist";
    return(
        <>
            <Banner
            imagename="/herobg.jpeg"
            title={pageName}
            subtitle={pageDescription}
            />

            <section className="bg-gray-100 p-4 md:px-20 md:py-20">
            <div className="mx-auto w-full max-w-[1100px] rounded-xl bg-white p-4 md:p-10 shadow">
                <>
                {children}
                </>
            </div>
            </section>
        </>
    );

}
