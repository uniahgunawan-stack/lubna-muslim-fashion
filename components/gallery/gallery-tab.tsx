"use clinet";
import { ProductImage } from "@/actions/get-products";
import { cn } from "@/lib/utils";
import { Tab } from "@headlessui/react";
import Image from "next/image";


interface GalleryTabProps{
    images: ProductImage;
}

const GalleryTab:React.FC<GalleryTabProps> = ({images}) => {
    return (
        <Tab className="relative flex min-w-[80px] sm:min-w-[80px] lg:min-w-[90px] aspect-square cursor-pointer items-center justify-center bg-white">
            {({selected}) => ( 
                <div className="relative w-full h-full">
                    <span className="absolute  aspect-square inset-0 overflow-hidden rounded-md bg-transparent ">
                        <Image fill src={images.url}
                        alt="image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover w-40 h-40"
                        priority={selected}/>
                    </span>
                    <span
                    className={cn("absolute inset-0 rounded-md ring-offset-2",
                        selected ? "ring-orange-400" : "ring-orange-500"
                    )}></span>
                </div>
            )}
            </Tab>
    );
};
export default GalleryTab;