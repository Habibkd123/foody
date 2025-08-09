import { useSalesService } from "../../apiservices/useSalesService";

const TopProduct = () => {
  const {  loading,topProducts  } = useSalesService();
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Top Products
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Best performing products by sales
            </p>
          </div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-white/[0.02] animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded dark:bg-gray-700"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded dark:bg-gray-700"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {topProducts?.productsByCategory.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-100 rounded-lg dark:bg-brand-500/20">
                    <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white/90">
                      {product._id}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.count.toLocaleString()} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white/90">
                    ${product.totalValue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      );
};

export default TopProduct;
