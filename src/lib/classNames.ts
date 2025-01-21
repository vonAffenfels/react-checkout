export default function classNames(...classes: Array<string | number>): string {
    return classes.filter(Boolean).join(" ");
}
