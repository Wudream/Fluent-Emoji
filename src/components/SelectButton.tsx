export default (props) => {
    const solt = props.children
    const isHighlight = props.highlight
    return (
        <div
            bg-gray-100 p-2
            rounded-md
            border border-2 border-solid
            cursor-pointer
            transition-colors
            hover="bg-red-100  border-red-400"
            class={isHighlight() ? "bg-red-100  border-red-400" : 'border-transparent'}
        >
            {isHighlight()}
            {solt}
        </div>
    )
}