export default function ComingSoon() {
  return (
    <main className="min-h-screen">
      <section className="relative h-screen">
        <div className="absolute inset-0 z-0">
          <img
            src="/Badstu.jpg"
            alt="Person som hopper i vannet - badstu opplevelse"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-6xl font-bold text-white mb-6">
            Bergen Badstu
          </h1>
          <p className="text-2xl text-white mb-8">
            Vi lanserer snart!
          </p>
        </div>
      </section>
    </main>
  );
}