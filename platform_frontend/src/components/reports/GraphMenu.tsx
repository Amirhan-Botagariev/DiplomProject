import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function GraphMenu({
  onDelete,
  onEdit,
}: {
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-1 hover:bg-gray-100 rounded-full">
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onEdit}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                }`}
              >
                  Редактировать
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onDelete}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  active ? "bg-red-100 text-red-700" : "text-red-600"
                }`}
              >
                  Удалить
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}