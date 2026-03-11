"use client";

export default function Cubes() {
  const cubes = [
    { left: "45vw", top: "80vh", delay: 0 },
    { left: "25vw", top: "40vh", delay: 2 },
    { left: "75vw", top: "50vh", delay: 4 },
    { left: "90vw", top: "10vh", delay: 6 },
    { left: "10vw", top: "85vh", delay: 8 },
    { left: "50vw", top: "10vh", delay: 10 },
  ];

  return (
    <>
      {cubes.map((cube, i) => (
        <div
          key={i}
          className="cube"
          style={{
            left: cube.left,
            top: cube.top,
            animationDelay: `${cube.delay}s`,
          }}
        />
      ))}
    </>
  );
}
