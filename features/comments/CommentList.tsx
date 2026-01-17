export default function CommentList({ itemId }: { itemId: string }) {
  return (
    <div className="mt-4 space-y-2">
      <h4>Comments</h4>
      <div className="p-3 bg-gray-50 rounded text-sm">No comments yet</div>
    </div>
  );
}
