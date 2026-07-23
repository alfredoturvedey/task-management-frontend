import BannerHome from "@/components/features/Home/Banners";
import MainLayout from "@/components/layout/MainLayout";

const HomePage = () => {

  return (
    <MainLayout>
      <>
        <div className="w-full">
        <BannerHome/>
        </div>
      </>
  </MainLayout>
  )
}

export default HomePage;