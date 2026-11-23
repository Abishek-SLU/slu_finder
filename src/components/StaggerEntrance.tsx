import { Children, Fragment, isValidElement, ReactNode } from "react";
import { View, ViewProps } from "react-native";
import PageEntrance, { EntranceDirection } from "./PageEntrance";

const DEFAULT_DIRECTIONS: EntranceDirection[] = ["bottom"];

/** Preserve each section's layout while revealing siblings in a quick sequence. */
export default function StaggerEntrance({ children, delay = 0, directions = DEFAULT_DIRECTIONS, ...props }: ViewProps & { delay?: number; directions?: readonly EntranceDirection[] }) {
  let order = 0;
  function reveal(nodes: ReactNode): ReactNode {
    return Children.map(nodes, child => {
      if (!isValidElement<{ children?: ReactNode }>(child)) return child;
      if (child.type === Fragment) return <Fragment key={child.key}>{reveal(child.props.children)}</Fragment>;
      const index = order++;
      const start = delay + Math.min(index, 7) * 140;
      const direction = directions[index % directions.length] ?? "bottom";
      if (child.type === View) {
        return <PageEntrance {...child.props as ViewProps} key={child.key} delay={start} direction={direction} />;
      }
      return <PageEntrance key={child.key} delay={start} direction={direction}>{child}</PageEntrance>;
    });
  }
  return <View {...props}>{reveal(children)}</View>;
}
