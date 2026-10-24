import {
  siAmg,
  siAudi,
  siBmw,
  siChevrolet,
  siFord,
  siHonda,
  siJeep,
  siPorsche,
  siRam,
  siTesla,
  siToyota,
  siVolkswagen,
  siYamahamotorcorporation,
} from "simple-icons";

/**
 * Logotipos de fabricantes para o carrossel de marcas.
 *
 * Fonte padrão: Simple Icons (https://simpleicons.org, licença CC0). As marcas
 * pertencem aos respectivos fabricantes e são usadas apenas para identificar
 * os veículos do catálogo.
 *
 * Para usar um arquivo oficial, salve o SVG em /public/images/marcas/<slug>.svg:
 * ele tem prioridade sobre o ícone abaixo. Marcas sem ícone aparecem pelo nome
 * até o arquivo ser fornecido.
 */

export interface BrandMark {
  slug: string;
  /** Caminho SVG (viewBox 0 0 24 24) e a área efetivamente ocupada pelo desenho. */
  icon?: { path: string; box: [x: number, y: number, w: number, h: number] };
}

export const brandMarks: Record<string, BrandMark> = {
  Porsche: { slug: "porsche", icon: { path: siPorsche.path, box: [2.65, 0, 18.71, 24] } },
  "Mercedes-AMG": { slug: "mercedes-amg", icon: { path: siAmg.path, box: [0, 10.81, 24, 2.37] } },
  BMW: { slug: "bmw", icon: { path: siBmw.path, box: [0, 0, 24, 24] } },
  Audi: { slug: "audi", icon: { path: siAudi.path, box: [0, 7.85, 24, 8.3] } },
  Chevrolet: { slug: "chevrolet", icon: { path: siChevrolet.path, box: [0, 8.09, 24, 7.82] } },
  Ford: { slug: "ford", icon: { path: siFord.path, box: [0, 7.5, 24, 9] } },
  Honda: { slug: "honda", icon: { path: siHonda.path, box: [0, 2.24, 24, 19.53] } },
  Jeep: { slug: "jeep", icon: { path: siJeep.path, box: [0, 7.17, 24, 9.66] } },
  Ram: { slug: "ram", icon: { path: siRam.path, box: [0.56, 0, 22.87, 24] } },
  Tesla: { slug: "tesla", icon: { path: siTesla.path, box: [0, 0, 24, 24] } },
  Toyota: { slug: "toyota", icon: { path: siToyota.path, box: [0, 3.85, 24, 16.3] } },
  Volkswagen: { slug: "volkswagen", icon: { path: siVolkswagen.path, box: [0, 0, 24, 24] } },
  Yamaha: { slug: "yamaha", icon: { path: siYamahamotorcorporation.path, box: [0, 0, 24, 24] } },
  // Sem ícone livre disponível: arquivos pendentes em /public/images/marcas/<slug>.svg
  "Land Rover": { slug: "land-rover" },
  Jaguar: { slug: "jaguar" },
};

/**
 * Tamanho óptico: mesma área visual para todos os logotipos, com altura e
 * largura máximas para evitar que marcas horizontais dominem a faixa.
 */
export function opticalSize(aspect: number, area = 1900, maxWidth = 116, maxHeight = 46) {
  let height = Math.min(Math.sqrt(area / aspect), maxHeight);
  let width = height * aspect;
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspect;
  }
  return { width: Math.round(width), height: Math.round(height) };
}
