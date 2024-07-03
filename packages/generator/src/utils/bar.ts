import { Presets, SingleBar } from "cli-progress";

interface Props {
  name: string;

  total: number;
}

export const createBar = ({ name, total }: Props) => {
  const bar = new SingleBar(
    {
      format: `${name} Generate | {bar} | {percentage}% | {value}/{total}`,
      hideCursor: true,
    },
    Presets.shades_grey,
  );

  const start = () => {
    bar.start(total, 0);
  };

  const stop = () => {
    bar.stop();
  };

  const increment = () => {
    bar.increment();
  };

  return { start, stop, increment };
};
