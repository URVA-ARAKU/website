const menuGroups = [
  {
    label: 'Signature spreads',
    items: [
      ['Hyderabadi Biryani', 'Fragrant basmati, slow-cooked with layered spices'],
      ['Butter Chicken', 'Creamy, rich and finished with gentle smoke'],
      ['Paneer Tikka', 'Charred, smoky and prepared to order'],
    ],
  },
  {
    label: 'Live counters',
    items: [
      ['Dosa Counter', 'Crisp dosas served hot with fresh accompaniments'],
      ['Chaat Station', 'Bright, crunchy and assembled for your guests'],
      ['Dessert Table', 'Seasonal sweets and small indulgent finishes'],
    ],
  },
]

export default function MenuShowcase() {
  return (
    <section id="menu" className="bg-[#F4F1EA] px-5 py-20 text-[#5A3825] md:px-10 md:py-28 font-sans border-t border-[#E2D9CC]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8B5A2B]">
              From our kitchen
            </p>
            <h2 className="mt-5 font-serif text-5xl font-bold leading-[0.9] tracking-tight md:text-7xl text-[#5A3825]">
              Build a menu
              <br />
              <span className="font-serif italic text-[#8B5A2B]">made for yours.</span>
            </h2>
            <p className="mt-7 max-w-sm text-sm leading-7 text-[#5A3825]/80">
              Choose a direction, then let our team shape the portions, courses
              and service around your guests.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <p className="border-b border-[#E2D9CC] pb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#8B5A2B]">
                  {group.label}
                </p>
                <div>
                  {group.items.map(([name, description], index) => (
                    <article key={name} className="border-b border-[#E2D9CC] py-5">
                      <div className="flex gap-4">
                        <span className="pt-1 text-[10px] text-[#8B5A2B] font-mono">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-serif text-xl font-semibold text-[#5A3825]">
                            {name}
                          </h3>
                          <p className="mt-1 text-xs leading-5 text-[#5A3825]/75">
                            {description}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-5 border-t border-[#E2D9CC] pt-6 sm:flex-row sm:items-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B5A2B]">
            Vegetarian · Non-vegetarian · Custom menus
          </p>
          <a
            href="https://wa.me/919010995180"
            target="_blank"
            rel="noreferrer"
            className="w-fit bg-[#8B5A2B] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FAF8F4] transition hover:bg-[#5A3825] rounded-xl shadow-xs"
          >
            Request a custom menu
          </a>
        </div>
      </div>
    </section>
  )
}
