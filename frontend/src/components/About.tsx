export const About = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="flex justify-center py-3 text-center">
        <div className="flex flex-col justify-center max-w-md w-full text-2xl"></div>
      </div>

      <div className="flex justify-center text-center space-x-3">
        <a
          className="link-black"
          href="https://twitter.com/minhokim42"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Minho
        </a>
      </div>
    </div>
  );
};
