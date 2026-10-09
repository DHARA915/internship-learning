import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GitCompare, Info, X } from "lucide-react";
import { Button } from "../../components/ui/button";

import type { RootState, AppDispatch } from "../../Redux/store";
import {
  addProduct,
  removeProduct,
  clearProducts,
  clearCompareError,
  type ProductCategory,
} from "../../Redux/Slices/ProductCompareSlice/compareSlice";

import { COMPARE_CATEGORIES } from "../../utils/ProductCompUtils/Compareconfig";
import { CompareStepper } from "../../modules/CompareProducts/CompareStepper";
import { CompareCategoryCards } from "../CompareProducts/CompareCategoryCards";
import { CompareProductPicker } from "../CompareProducts/Compareproductpicker";
import { CompareSelectedBar } from "../CompareProducts/Compareselectedbar";
import CompareTable from "./CompareTable";

const MAX_COMPARE = 3;

const ComparePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { selectedProducts, category, error } = useSelector(
    (state: RootState) => state.compare,
  );  

  console.log("Selected Products:   ", selectedProducts)

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(category);
  const [picking, setPicking] = useState(false);

  const config = COMPARE_CATEGORIES.find((c) => c.id === selectedCategory) ?? null;


  console.log("Config:   " , config)

  const stage = !config
    ? "category"
    : picking || selectedProducts.length === 0
      ? "pick"
      : selectedProducts.length === 1
        ? "strip"
        : "compare";

   console.log("Stage here:  ", stage)
        
  const activeStep = stage === "category" ? 0 : stage === "compare" ? 2 : 1;

  // items that can still be added
  const available = useMemo(
    () =>
      config
        ? config.items.filter((i) => !selectedProducts.some((s) => s.id === i.id))
        : [],
    [config, selectedProducts],
  );

  /* ---------- actions ---------- */
  const chooseCategory = (id: ProductCategory) => {
    if (id !== selectedCategory) dispatch(clearProducts()); // never mix categories
    setSelectedCategory(id);
    setPicking(false);
  };

  const changeCategory = () => {
    dispatch(clearProducts());
    setSelectedCategory(null);
    setPicking(false);
  };

  // picking always closes the grid: 1 item -> + card, 2-3 items -> table
  const pickProduct = (product: any) => {
    dispatch(addProduct(product));
    setPicking(false);
  };

  const removeItem = (id: string) => {
    dispatch(removeProduct(id));
    setPicking(false);
  };

  return (
    <div className="min-h-full space-y-6 bg-primary p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-primary">
            <GitCompare className="size-7 text-button-primary" aria-hidden />
            {config ? `Compare ${config.title}` : "Compare Products"}
          </h1>

          <p className="mt-1 text-base text-secondary">
            Compare up to {MAX_COMPARE} {config ? config.plural : "products"} side by side and
            find the best one for you.
          </p>
        </div>
          {error && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Dismiss"
              onClick={() => dispatch(clearCompareError())}
              className="size-6 shrink-0 text-danger hover:bg-danger/10 hover:text-danger"
            >
              <X className="size-4" />
            </Button>
          )}
      
      </div>

      {/* ================= STEPPER ================= */}
      <CompareStepper active={activeStep} />

      {/* ================= STEP 1 ================= */}
      {stage === "category" && (
        <CompareCategoryCards
          categories={COMPARE_CATEGORIES}
          selected={selectedCategory}
          onSelect={chooseCategory}
        />
      )}

      {/* ================= selected category + chosen items ================= */}
      {config && selectedProducts.length > 0 && (
        <CompareSelectedBar
          category={config}
          selected={selectedProducts}
          max={MAX_COMPARE}
          adding={stage === "pick"}
          onChangeCategory={changeCategory}
          onAdd={() => setPicking(true)}
          onRemove={removeItem}
        />
      )}

      {/* ================= STEP 2 ================= */}
      {stage === "pick" && config && (
        <>
          {selectedProducts.length === 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={changeCategory}
              className="h-auto px-0 py-0 text-sm font-medium text-button-primary hover:bg-transparent hover:underline"
            >
              ← Change category ({config.title})
            </Button>
          )}

          <CompareProductPicker
            products={available}
            plural={config.plural}
            noun={config.noun}
            selectedCount={selectedProducts.length}
            max={MAX_COMPARE}
            highlights={config.highlights}
            onPick={pickProduct}
            onBack={selectedProducts.length > 0 ? () => setPicking(false) : undefined}
          />
        </>
      )}

      {/* one item chosen, waiting for the next */}
      {stage === "strip" && config && (
        <p className="rounded-2xl border border-dashed border-line px-4 py-12 text-center text-sm text-secondary">
          Add one more {config.noun} with the + card to see the comparison.
        </p>
      )}

      {/* ================= STEP 3 ================= */}
      {stage === "compare" && config && (
        <CompareTable
          products={selectedProducts}
          specs={config.specs}
          groups={config.groups}
        />
      )}
    </div>
  );
};

export default ComparePage;