import React, { createContext, useContext, useEffect, useState } from "react";
import { storeProducts, detailProduct } from "./data";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [detail, setDetail] = useState(detailProduct);
  const [cart, setCart] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(detail);
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const [cartTax, setCartTax] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    initializeProductsState();
  }, []);
  function initializeProductsState() {
    const initialProducts = storeProducts.reduce((total, product) => {
      const singleItem = { ...product };
      return (total = [...total, singleItem]);
    }, []);
    // -- you can use forEach method instead of reduce method
    // let tempProducts = [];
    // storeProducts.forEach((product) => {
    //   const singleItem = { ...product };
    //   tempProducts = [...tempProducts, singleItem];
    // });
    setProducts(initialProducts);
  }

  useEffect(() => {
    addTotals();
  }, [cart]);
  function addTotals() {
    const subTotal = cart.reduce((total, product) => {
      return (total += product.total);
    }, 0);
    const tempTax = 0.09 * subTotal;
    //tiFixed method return a string so we use parseFloat
    const tax = parseFloat(tempTax.toFixed(2));
    const cartTotal = subTotal + tax;
    setCartSubTotal(subTotal);
    setCartTax(tax);
    setCartTotal(cartTotal);
  }

  function addToCart(id) {
    const newProducts = products.map((product) => {
      if (product.id == id) {
        product.inCart = true;
        product.count = 1;
        product.total = product.price * product.count;
        setCart([...cart, product]);
      }
      return product;
    });
    setProducts(newProducts);
  }

  function handleDetail(id) {
    const detailProduct = products.find((product) => product.id == id);
    setDetail(detailProduct);
  }

  function closeModal() {
    setModalOpen(false);
  }

  const openModal = (id) => {
    setModalOpen(true);
    const modalProduct = products.find((product) => product.id == id);
    setModalProduct(modalProduct);
  };

  function increment(id) {
    const newProducts = products.map((product) => {
      if (product.id == id) {
        product.count += 1;
        const price = product.price;
        product.total = price * product.count;
      }
      return product;
    });
    setProducts(newProducts);
  }

  function decrement(id) {
    const newProducts = products.map((product) => {
      if (product.id == id) {
        product.count -= 1;
        const price = product.price;
        product.total = price * product.count;
      }
      return product;
    });
    setProducts(newProducts);
  }

  function removeItem(id) {
    const newProducts = products.map((product) => {
      if (product.id == id) {
        product.count = 0;
        product.inCart = false;
      }
      return product;
    });
    setProducts(newProducts);
    const newCart = cart.filter((product) => {
      return product.id !== id;
    });
    setCart(newCart);
  }

  function clearCart() {
    setCart([]);
    initializeProductsState();
  }

  return (
    <AppContext.Provider
      value={{
        products,
        detail,
        modalOpen,
        modalProduct,
        cart,
        cartSubTotal,
        cartTax,
        cartTotal,
        handleDetail,
        addToCart,
        openModal,
        closeModal,
        increment,
        decrement,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(AppContext);
};
export default AppProvider;
