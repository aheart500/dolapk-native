const Alert = (lang = "en", func, action, cb) => {
  const actionFormatted = action
    .split(" ")
    .map((i) => i.replace(/^./gi, (match) => match.toUpperCase()))
    .join(" ");
  let actionAr =
    action === "delete"
      ? "حذف"
      : action === "finish"
      ? "إنهاء"
      : action === "convert to processing"
      ? "تحويل قيد المعالجة"
      : action === "convert to processed"
      ? "تحويل جاهز للشحن"
      : action === "deliver to shipment"
      ? "تحويل تم التسليم للشحن"
      : action === "convert ready for distribution"
      ? "تحويل جاهز للتوزيع"
      : action === "cancel"
      ? "إلغاء"
      : "تفعيل";
  return lang === "ar"
    ? {
        title: actionAr,
        message: (n) => `هل انت متأكد أنك تريد ${actionAr} ${n} طلب؟`,
        buttons: [
          {
            text: "نعم",
            onPress: () => {
              func();
              cb();
            },
          },
          {
            text: "لا",
            style: "cancel",
          },
        ],
      }
    : {
        title: `${actionFormatted} orders`,
        message: (n) => `Are you sure you wanna ${action} ${n} orders?`,
        buttons: [
          {
            text: "Yeeh",
            onPress: () => {
              func();
              cb();
            },
          },
          {
            text: "No",
            style: "cancel",
          },
        ],
      };
};
export default Alert;
