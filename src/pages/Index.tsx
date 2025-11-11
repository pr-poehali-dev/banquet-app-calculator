import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Dish {
  id: string;
  name: string;
  portionSize: number;
  ingredients: Ingredient[];
  category: string;
}

const Index = () => {
  const [guests, setGuests] = useState<number>(10);
  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: '1',
      name: 'Оливье',
      portionSize: 200,
      category: 'Салаты',
      ingredients: [
        { name: 'Картофель', amount: 300, unit: 'г' },
        { name: 'Морковь', amount: 150, unit: 'г' },
        { name: 'Яйца', amount: 3, unit: 'шт' },
        { name: 'Горошек', amount: 100, unit: 'г' },
        { name: 'Майонез', amount: 150, unit: 'г' },
      ],
    },
    {
      id: '2',
      name: 'Куриные котлеты',
      portionSize: 150,
      category: 'Горячее',
      ingredients: [
        { name: 'Куриный фарш', amount: 500, unit: 'г' },
        { name: 'Лук', amount: 100, unit: 'г' },
        { name: 'Яйца', amount: 1, unit: 'шт' },
        { name: 'Хлеб', amount: 50, unit: 'г' },
      ],
    },
    {
      id: '3',
      name: 'Греческий салат',
      portionSize: 180,
      category: 'Салаты',
      ingredients: [
        { name: 'Помидоры', amount: 200, unit: 'г' },
        { name: 'Огурцы', amount: 150, unit: 'г' },
        { name: 'Сыр фета', amount: 100, unit: 'г' },
        { name: 'Оливки', amount: 50, unit: 'г' },
        { name: 'Масло оливковое', amount: 30, unit: 'мл' },
      ],
    },
  ]);

  const [newDish, setNewDish] = useState<Partial<Dish>>({
    name: '',
    portionSize: 0,
    category: '',
    ingredients: [],
  });

  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: '',
    amount: 0,
    unit: 'г',
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calculateTotalIngredients = () => {
    const ingredientsMap = new Map<string, { amount: number; unit: string }>();

    dishes.forEach((dish) => {
      const isColdDish = dish.category === 'Салаты' || dish.category === 'Холодные закуски';
      const portions = isColdDish ? Math.ceil(guests * 1.5) : Math.ceil(guests / 1);
      dish.ingredients.forEach((ingredient) => {
        const key = `${ingredient.name}_${ingredient.unit}`;
        const existing = ingredientsMap.get(key);
        const totalAmount = ingredient.amount * portions;

        if (existing) {
          ingredientsMap.set(key, {
            amount: existing.amount + totalAmount,
            unit: ingredient.unit,
          });
        } else {
          ingredientsMap.set(key, {
            amount: totalAmount,
            unit: ingredient.unit,
          });
        }
      });
    });

    return Array.from(ingredientsMap.entries()).map(([key, value]) => ({
      name: key.split('_')[0],
      amount: value.amount,
      unit: value.unit,
    }));
  };

  const addIngredientToNewDish = () => {
    if (newIngredient.name && newIngredient.amount > 0) {
      setNewDish({
        ...newDish,
        ingredients: [...(newDish.ingredients || []), { ...newIngredient }],
      });
      setNewIngredient({ name: '', amount: 0, unit: 'г' });
    }
  };

  const saveDish = () => {
    if (newDish.name && newDish.portionSize && newDish.category && newDish.ingredients && newDish.ingredients.length > 0) {
      setDishes([
        ...dishes,
        {
          id: Date.now().toString(),
          name: newDish.name,
          portionSize: newDish.portionSize,
          category: newDish.category,
          ingredients: newDish.ingredients,
        },
      ]);
      setNewDish({ name: '', portionSize: 0, category: '', ingredients: [] });
      setIsDialogOpen(false);
    }
  };

  const removeDish = (id: string) => {
    setDishes(dishes.filter((d) => d.id !== id));
  };

  const totalIngredients = calculateTotalIngredients();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
            <Icon name="UtensilsCrossed" size={48} className="text-primary" />
            Банкетный калькулятор
          </h1>
          <p className="text-lg text-muted-foreground">
            Автоматический расчёт порций и ингредиентов для вашего мероприятия
          </p>
        </div>

        <Card className="mb-8 shadow-lg border-2">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Users" size={28} />
              Количество гостей
            </CardTitle>
            <CardDescription className="text-base">
              Укажите количество приглашённых для автоматического расчёта
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setGuests(Math.max(1, guests - 5))}
                className="h-16 w-16 text-2xl"
              >
                <Icon name="Minus" size={24} />
              </Button>
              <div className="flex-1">
                <Input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 0))}
                  className="text-center text-4xl font-bold h-20 border-2"
                />
              </div>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setGuests(guests + 5)}
                className="h-16 w-16 text-2xl"
              >
                <Icon name="Plus" size={24} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-14 text-base">
            <TabsTrigger value="calculator" className="text-base">
              <Icon name="Calculator" size={20} className="mr-2" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="menu" className="text-base">
              <Icon name="ChefHat" size={20} className="mr-2" />
              Меню
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="text-base">
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Ингредиенты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Расчёт порций</CardTitle>
                <CardDescription className="text-base">
                  На {guests} {guests === 1 ? 'гостя' : 'гостей'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dishes.map((dish) => {
                  const isColdDish = dish.category === 'Салаты' || dish.category === 'Холодные закуски';
                  const portions = isColdDish ? Math.ceil(guests * 1.5) : Math.ceil(guests / 1);
                  return (
                    <Card key={dish.id} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{dish.name}</h3>
                              <Badge variant="secondary" className="text-sm">
                                {dish.category}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-base">
                              Порция: {dish.portionSize}г
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-primary">{portions}</p>
                            <p className="text-sm text-muted-foreground">порций</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Управление меню</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="text-base h-12">
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить блюдо
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Новое блюдо</DialogTitle>
                    <DialogDescription className="text-base">
                      Заполните информацию о блюде и его составе
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base">
                        Название блюда
                      </Label>
                      <Input
                        id="name"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        placeholder="Например: Оливье"
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="portion" className="text-base">
                          Размер порции (г)
                        </Label>
                        <Input
                          id="portion"
                          type="number"
                          value={newDish.portionSize || ''}
                          onChange={(e) =>
                            setNewDish({ ...newDish, portionSize: parseInt(e.target.value) || 0 })
                          }
                          placeholder="200"
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-base">
                          Категория
                        </Label>
                        <Input
                          id="category"
                          value={newDish.category}
                          onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                          placeholder="Салаты, Горячее..."
                          className="h-12 text-base"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">Ингредиенты</Label>
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-5">
                          <Input
                            placeholder="Название"
                            value={newIngredient.name}
                            onChange={(e) =>
                              setNewIngredient({ ...newIngredient, name: e.target.value })
                            }
                            className="h-12 text-base"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            placeholder="Кол-во"
                            value={newIngredient.amount || ''}
                            onChange={(e) =>
                              setNewIngredient({
                                ...newIngredient,
                                amount: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="h-12 text-base"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="ед."
                            value={newIngredient.unit}
                            onChange={(e) =>
                              setNewIngredient({ ...newIngredient, unit: e.target.value })
                            }
                            className="h-12 text-base"
                          />
                        </div>
                        <div className="col-span-2">
                          <Button
                            onClick={addIngredientToNewDish}
                            variant="outline"
                            className="h-12 w-full"
                          >
                            <Icon name="Plus" size={20} />
                          </Button>
                        </div>
                      </div>

                      {newDish.ingredients && newDish.ingredients.length > 0 && (
                        <div className="space-y-2 mt-4">
                          {newDish.ingredients.map((ing, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                            >
                              <span className="text-base">
                                {ing.name}: {ing.amount} {ing.unit}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setNewDish({
                                    ...newDish,
                                    ingredients: newDish.ingredients?.filter((_, i) => i !== idx),
                                  })
                                }
                              >
                                <Icon name="X" size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveDish} size="lg" className="text-base h-12">
                      <Icon name="Save" size={20} className="mr-2" />
                      Сохранить блюдо
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {dishes.map((dish) => (
                <Card key={dish.id} className="shadow-lg border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{dish.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-sm">
                            {dish.category}
                          </Badge>
                          <Badge variant="outline" className="text-sm">
                            {dish.portionSize}г
                          </Badge>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => removeDish(dish.id)}>
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-3 text-base">Состав:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {dish.ingredients.map((ing, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon name="Dot" size={16} />
                          {ing.name}: {ing.amount} {ing.unit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ingredients" className="space-y-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="ShoppingCart" size={28} />
                  Список закупки на {guests} {guests === 1 ? 'гостя' : 'гостей'}
                </CardTitle>
                <CardDescription className="text-base">
                  Общее количество ингредиентов для всех блюд
                </CardDescription>
              </CardHeader>
              <CardContent>
                {totalIngredients.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {totalIngredients.map((ingredient, idx) => (
                      <Card key={idx} className="border-2">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon name="Package" size={24} className="text-primary" />
                              </div>
                              <span className="text-lg font-medium">{ingredient.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {ingredient.amount.toFixed(0)}
                              </p>
                              <p className="text-sm text-muted-foreground">{ingredient.unit}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="ShoppingBasket" size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Добавьте блюда в меню для расчёта ингредиентов</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;