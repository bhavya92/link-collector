export const SkeletonLoader = () => {
    return <div className="w-full h-full grid grid-cols-1 tb:grid-cols-2 ls:grid-cols-4 ll:grid-cols-5 gap-4 pt-8 px-8">
        {Array.from({ length: 4 }).map((_, i) => (
    
            <div key={i} className="flex-flex-col w-full h-fit rounded-xl shadow-xs border-2 px-2 py-4  border-slate-200 bg-slate-50">
                <div className="w-full h-4 animate-pulse rounded-xl bg-slate-300"></div>
                <div className="flex gap-x-2 mt-6 w-fit h-fit">
                    <div className="px-2 py-0.5 rounded-xl w-8 h-4 bg-slate-300 animate-pulse"/>
                    <div className="px-2 py-0.5 rounded-xl w-8 h-4 bg-slate-300 animate-pulse"/>
                    <div className="px-2 py-0.5 rounded-xl w-8 h-4 bg-slate-300 animate-pulse"/>
                </div>
                <div className="w-2/3 h-2 mt-6 animate-pulse rounded-xl bg-slate-300"></div>
            </div>
       
        ))}
    
  </div>
}