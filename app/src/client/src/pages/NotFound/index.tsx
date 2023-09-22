import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="">
          <h1 className="my-2 text-gray-800 font-bold text-2xl">
            404 Not Found
          </h1>
          <p className="my-2 text-gray-800">
            Sorry about that! Please go back to the home page. Thank you!
          </p>
          <Link to="/">
            <Button>To Home Page</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
