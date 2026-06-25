import logo from "@/assets/images/logo.svg"
function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-10 text-center">
      <img src={logo} alt="loading" width={96} height={96} className="animate-bounce" />
      <div className="flex flex-col gap-3 ">
        <div className="h-20 w-200 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-20 w-200  animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
         <div className="h-20 w-200animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
        <div className="h-20 w-200  animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  )
}

export default Loading
