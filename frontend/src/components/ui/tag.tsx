export const Tag = ({tagName}: {tagName:string}) => {
    return <div className="px-2 py-1 text-xs w-fit h-fit rounded-xl bg-red-200">
        {tagName}
    </div>
}