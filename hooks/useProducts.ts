import useSWR, { SWRConfiguration } from "swr";
import { InterfaceProduct } from "@/interfaces";


// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json());

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
	// const { data, error, isLoading } = useSWR("/api/products", fetcher, { refreshInterval: 1000 });
	// const { data, error, isLoading } = useSWR<InterfaceProduct[]>(`/api${ url }`, fetcher, config);
	const { data, error, isLoading } = useSWR<InterfaceProduct[]>(`/api${ url }`, config);
	
	return {
		products: data || [],
		isLoading: !error && !data,
		isError: error
	};
};