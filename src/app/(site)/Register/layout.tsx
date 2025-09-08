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

            <section className="bg-gray-100 px-6 py-20 md:px-20">
            <div className="mx-auto w-[80%] max-w-[1000px] rounded-xl bg-white p-10 shadow">
                <>
                {children}
                </>
            </div>
            </section>
        </>
    );

}