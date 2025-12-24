export function groupAttributesByKey(product: any | undefined) {
  if (!product) return null;
  const allAttributes = [...(product.attributes || [])];

  if (product.modifications && Array.isArray(product.modifications)) {
    product.modifications.forEach((modification: any) => {
      if (modification.attributes && Array.isArray(modification.attributes)) {
        allAttributes.push(...modification.attributes);
      }
    });
  }

  const groupedByKey: Record<number, any[]> = {};

  allAttributes.forEach(attribute => {
    if (attribute.key && typeof attribute.key.id !== 'undefined') {
      const keyId = attribute.key.id;

      // Agar bu key id uchun array mavjud bo'lmasa, yaratish
      if (!groupedByKey[keyId]) {
        groupedByKey[keyId] = [];
      }

      // Takrorlanmasligini tekshirish (value.id bo'yicha)
      // Bir xil value.id'ga ega bo'lgan attribute'lar takrorlanmasligi kerak
      const exists = groupedByKey[keyId].some(
        attr => attr.value.id === attribute.value.id
      );
      if (!exists) {
        groupedByKey[keyId].push(attribute);
      }
    }
  });

  return groupedByKey;
}
