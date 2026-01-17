export default function Column({
  title,
  items,
}: {
  title: string;
  items: any[];
}) {
  return (
    <div className="min-w-[300px] p-4 bg-gray-100 rounded">
      <h3>{title}</h3>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="p-2 bg-white rounded shadow-sm">
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
