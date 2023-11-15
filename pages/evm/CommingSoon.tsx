import Header from "../components/Header";
import { Toaster } from "react-hot-toast";

export default function CommingSoon() {
  return (
    <div className="flex flex-col items-center justify-between p-6">
      <Toaster position="bottom-left" toastOptions={{ duration: 5000 }} />
      <Header></Header>
      <div className="flex items-center font-bold text-4xl my-10 py-10">
        Developping Comming Soon.......
      </div>
    </div>
  )
}