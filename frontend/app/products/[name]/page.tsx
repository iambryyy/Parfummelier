"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { api } from "@/app/lib/axios";
import LoadingScreen from "@/app/components/common/LoadingScreen/LoadingScreen";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/Card";
import AccordMatchPercent from "../../components/ui/accordmatchpercent/AccordMatchPercent";
import { Heart } from "lucide-react";
import axios from "axios";

interface Accord {
  name: string;
  background_color: string;
}

interface Product {
  id: number;
  name: string;
  accords: Accord[];
  brand: string;
  imageURL: string | null;
  description?: string;
}

const getImageUrl = (url: string | null) => {
  if (!url) return null;
  try {
    const fixedUrl = url.replace("/images", "/images/");
    const imageUrl = new URL(fixedUrl);

    if (process.env.NODE_ENV === "development") {
      imageUrl.hostname = "localhost";
      imageUrl.port = 8000;
    }
    return imageUrl.toString();
  } catch (error) {
    console.error("Error processing image URL: ", error);
    return url;
  }
};

export default function SingleProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.name) {
        setError("Product name is missing");
        setIsLoading(false);
        return;
      }
      try {
        // make sure to decode the URL paramter since it might contain space
        const decodedName = decodeURIComponent(params.name as string);
        // sending request the backend
        const { data } = await api.get(
          `/products/products/${encodeURIComponent(decodedName)}`,
        );
        const transformedProduct = {
          ...data,
          imageURL: getImageUrl(data.imageURL),
        };
        setProduct(transformedProduct);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch product",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params.name]);

  const handleToggleFavorite = async () => {
    try {
      const tokenResponse = await axios.get("/api/getAccessToken");
      const accessToken = tokenResponse.data.access_token;

      if (!accessToken) {
        throw new Error("No access token available");
      }

      // prespare the request data
      const requestData = {
        favorite_product_name: product?.name,
        action: favorite ? "remove" : "add",
      };

      const response = await axios.put(
        "http://localhost:8000/user/scentbank/products",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        setFavorite((prev) => !prev);
        setUpdateError(null);
      }
    } catch (error) {
      // handle errors
      console.error("Error updating favorite status: ", error);
      setUpdateError("Failed to update favorite status");

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data.error || "Failed to update favorite status";
        setUpdateError(errorMessage);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (error)
    return <div className="text-center text-red-500 p-8">Error: {error}</div>;
  if (!product)
    return <div className="text-center p-8">Product not found </div>;

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="relative">
                  {!imageError && product.imageURL ? (
                    <div className="relative w-full aspect-[3/4]">
                      <Image
                        src={product.imageURL}
                        alt={product.name}
                        fill
                        className="rounded-lg object-cover"
                        onError={() => setImageError(true)}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>

                {/* Product Detail section */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-xl text-gray-600">{product.brand}</p>
                  </div>

                  <AccordMatchPercent productAccords={product.accords} />

                  <div>
                    <h2 className="text-xl font-semibold mb-3">Accords</h2>
                    <div className="flex flex-wrap gap-2">
                      {product.accords.map((accord, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: accord.background_color,
                            color: isLightColor(accord.background_color)
                              ? "black"
                              : "white",
                          }}
                        >
                          {accord.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* add to favorite */}
                  <button
                    className="ml-2 px-3 py-1 rounded-full text-sm"
                    onClick={handleToggleFavorite}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <Heart
                        fill={favorite ? "currentColor" : "none"}
                        size={24}
                      />
                    )}
                  </button>
                  {updateError && (
                    <p className="text-red-500 text-sm mt-2">{updateError}</p>
                  )}
                </div>
              </div>

              {/* Description Card */}
              {product.description && (
                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{product.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function isLightColor(color: string | undefined) {
  if (!color) {
    return true;
  }

  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}
