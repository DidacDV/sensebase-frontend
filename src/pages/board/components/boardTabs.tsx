import { motion } from "framer-motion";

interface BoardTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const BoardTabs: React.FC<BoardTabsProps> = ({ activeTab, setActiveTab }) => {
    const tabs = ["Context", "Recommendations", "Tariff simulator", "Cost optimization"];

    return (
        <div className="flex border-b border-gray-300 mt-3 w-full relative">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                        flex-1 text-center p-3 pb-0 text-lg font-medium relative
                        ${activeTab === tab ? "text-[#1A3D63]" : "text-black"}
                    `}
                >
                    {tab}

                    {/* Animated underline */}
                    {activeTab === tab && (
                        <motion.span
                            layoutId="tab-underline"
                            className="absolute left-0 bottom-0 h-0.5 w-full bg-[#1A3D63]"
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                            }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
};

export default BoardTabs;
