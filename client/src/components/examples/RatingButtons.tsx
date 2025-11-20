import RatingButtons from '../RatingButtons';

export default function RatingButtonsExample() {
  return (
    <div className="p-4">
      <RatingButtons initialLikes={1247} initialDislikes={23} streamId="example" />
    </div>
  );
}
