import React from 'react'
import type { GroupSet, SpecGroup, SpecRow } from './Helper/Comparetype';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {cn} from '../../lib/utils'

const CompareTable =({
  products,
  specs,
  groups,
}: {
  products: any[];
  specs: SpecRow[];
  groups: GroupSet;
})  => { 

  const GROUP_STYLE: Record<Exclude<SpecGroup, "none">, { stripe: string; text: string }> = {
  basic: { stripe: "border-l-blue-500", text: "text-blue-600 dark:text-blue-400" },
  display: { stripe: "border-l-green-500", text: "text-green-600 dark:text-green-400" },
  camera: { stripe: "border-l-orange-500", text: "text-orange-600 dark:text-orange-400" },
  additional: { stripe: "border-l-purple-500", text: "text-purple-600 dark:text-purple-400" },
};
  const groupSpan = (i: number) => {
    if (i > 0 && specs[i - 1].group === specs[i].group) return 0;
 
    let n = 1;
    while (specs[i + n]?.group === specs[i].group) n++;
    return n;
  };
  
  console.log("Products:" , products);

   return (
    <div className=" overflow-hidden rounded-2xl border border-line bg-primary">
      <Table className="min-w-[40rem] table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead className="h-11 w-52 px-4 font-semibold text-primary">Product</TableHead>
             
            {products.map((p) => (
              <TableHead
                key={p.id}
                className="h-11 border-l border-line px-4 text-center font-semibold text-primary"
              >
                {p.name}
              </TableHead>
            ))}
 
          </TableRow>
        </TableHeader>
 
        <TableBody>
          {specs.map((row, i) => {
            const Icon = row.icon;
            const span = groupSpan(i);
            const style = row.group === "none" ? null : GROUP_STYLE[row.group];
            const meta = row.group === "none" ? null : groups[row.group];
            
            return (
              <TableRow
                key={row.key}
                className={cn(
                  "hover:bg-transparent",
                  row.group !== "none" && "even:bg-muted/40",
                )}
              >
                <TableCell
                  className={cn(
                    "px-4 py-2.5 font-semibold text-primary",
                    style && `border-l-4 ${style.stripe}`,
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4 shrink-0 text-secondary" aria-hidden />
                    {row.label}
                  </span>
                </TableCell>
 
                {products.map((p) => (
                  <TableCell
                    key={p.id}
                    className="whitespace-normal border-l border-line px-4 py-2.5 text-center align-middle text-primary"
                  >
                    <span className="inline-block">{row.render(p)}</span>
                  </TableCell>
                ))}
 
                {/* {span > 0 && (
                  <TableCell
                    rowSpan={span}
                    className="hidden whitespace-normal bg-primary p-0 pl-4 align-middle lg:table-cell"
                  >
                    {meta && style && (
                      <div className={cn("border-l-4 py-2 pl-3", style.stripe)}>
                        <p className={cn("text-sm font-semibold", style.text)}>{meta.label}</p>
                        <p className="text-xs text-secondary">{meta.hint}</p>
                      </div>
                    )}
                  </TableCell>
                )} */}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

}

export default CompareTable