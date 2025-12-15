/**
 * Путь: /components/calculation/EstimateTable.tsx
 * Назначение: Компонент отображения таблицы сметы с позициями работ
 * Описание: Детальная таблица со всеми позициями: код, наименование, количество, цены
 */

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import type { EstimateItemDisplay } from '@/types/calculation';

interface EstimateTableProps {
  items: EstimateItemDisplay[];
  totalCost: number;
}

export function EstimateTable({ items, totalCost }: EstimateTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(quantity);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Смета на обследование
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[100px]">Код</TableHead>
                  <TableHead className="min-w-[300px]">Наименование работ</TableHead>
                  <TableHead className="text-center w-[80px]">Ед. изм.</TableHead>
                  <TableHead className="text-right w-[100px]">Кол-во</TableHead>
                  <TableHead className="text-right w-[120px]">
                    Цена за ед., ₸
                  </TableHead>
                  <TableHead className="text-center w-[100px]">Коэф.</TableHead>
                  <TableHead className="text-right w-[150px]">
                    Стоимость, ₸
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-xs">
                      {item.code}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{item.workType}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.section}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.tableReference}
                          </Badge>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.unit}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatQuantity(item.quantity)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.coefficient > 1 ? 'default' : 'secondary'}>
                        {item.coefficient.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatPrice(item.cost)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Итоговая строка */}
                <TableRow className="bg-blue-50 font-bold">
                  <TableCell colSpan={6} className="text-right">
                    ИТОГО:
                  </TableCell>
                  <TableCell className="text-right text-blue-700">
                    {formatPrice(totalCost)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Примечания */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">Примечания:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Цены указаны без учёта НДС</li>
            <li>• Расчёт выполнен по СЦИ РК 8.03-04-2025</li>
            <li>• Коэффициенты применяются согласно Таблице 2</li>
            <li>• Стоимость может меняться в зависимости от условий объекта</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
