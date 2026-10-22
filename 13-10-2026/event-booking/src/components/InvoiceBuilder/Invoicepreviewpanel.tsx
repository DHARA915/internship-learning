
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {InvoicePreview} from "@/components/InvoiceBuilder/InvoicePreview";


/** Accent colour for each theme (also used by DesignPanel). */
const SHEET_WIDTH = 794; // A4 at 96 dpi
const SHEET_HEIGHT = 1123;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.5;

/** Toolbar + scrollable viewport around the sheet. */
export function InvoicePreviewPanel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const [fitScale, setFitScale] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(SHEET_HEIGHT);
  const [zoom, setZoom] = useState<number | null>(null); // null = fit to width

  useEffect(() => {
    const viewport = viewportRef.current;
    const sheet = sheetRef.current;
    if (!viewport || !sheet) return;

    const measure = () => {
      setFitScale(Math.min(1, viewport.clientWidth / SHEET_WIDTH));
      setSheetHeight(sheet.offsetHeight);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, []);

  const scale = zoom ?? fitScale;
  const step = (change: number) =>
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((scale + change) * 10) / 10)));

  return (
    <aside
      aria-label="Invoice preview"
      className="min-w-0 overflow-hidden scrollbar-none rounded-2xl border border-line bg-muted lg:sticky lg:top-6"
    >
      <div className="flex items-center gap-1 border-b border-line bg-card px-3 py-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Zoom out"
          disabled={scale <= MIN_ZOOM}
          onClick={() => step(-0.1)}
        >
          <ZoomOut />
        </Button>
        <span className="w-14 text-center text-sm font-medium tabular-nums" aria-live="polite">
          {Math.round(scale * 100)}%
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Zoom in"
          disabled={scale >= MAX_ZOOM}
          onClick={() => step(0.1)}
        >
          <ZoomIn />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Fit to width"
          onClick={() => setZoom(null)}
        >
          <Maximize2 />
        </Button>
      </div>

      <div className="overflow-auto p-3 sm:p-5 lg:max-h-[calc(100vh-10rem)]">
        <div ref={viewportRef} className="w-full">
          <div
            className="mx-auto"
            style={{ width: SHEET_WIDTH * scale, height: sheetHeight * scale }}
          >
            <div
              ref={sheetRef}
              id="invoice-sheet"
              style={{ width: SHEET_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
            >
              <InvoicePreview />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}