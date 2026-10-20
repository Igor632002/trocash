import { HeartIcon, InfinityIcon, LeafLineIcon } from "./Icons";

type ValueItem = {
  title: string;
  text: string;
  Icon: typeof LeafLineIcon;
};

type ValueStripProps = {
  items: ValueItem[];
};

export function ValueStrip({ items }: ValueStripProps) {
  return (
    <section className="values" id="values">
      <div className="container values__inner">
        {items.map(({ title, text, Icon }, index) => {
          return (
            <div className="value-item" key={title}>
              <div className="value-item__icon">
                <Icon />
              </div>
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
              {index < items.length - 1 ? <div className="value-divider" /> : null}
            </div>
          );
        })}
        <div className="value-decor value-decor--left" aria-hidden="true">
          <LeafLineIcon size={92} />
        </div>
        <div className="value-decor value-decor--right" aria-hidden="true">
          <LeafLineIcon size={92} />
        </div>
      </div>
    </section>
  );
}
