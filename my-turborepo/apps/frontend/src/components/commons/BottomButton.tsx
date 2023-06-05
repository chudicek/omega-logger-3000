type BottomButtonProps = {
  text: string;
};
const BottomButton = ({ text }: BottomButtonProps) => {
  return (
    <div className="fixed bottom-0 inset-x-0 mx-auto mb-0 flex flex-col items-center bg-gradient-to-t from-white-smoke h-24">
      <button className="mb-8 mt-8 w-fit">{text}</button>
    </div>
  );
};

export default BottomButton;
