import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[56vh] w-full">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/40 to-white pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 h-full flex items-end pb-10">
        <div className="bg-white/70 backdrop-blur border border-white/60 rounded-2xl p-5 md:p-8 shadow-sm max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Design dynamic forms with drag and drop</h2>
          <p className="mt-2 text-zinc-600">A minimalist, interactive canvas to compose inputs, preview instantly, and save your form schema to Supabase.</p>
        </div>
      </div>
    </section>
  );
}
