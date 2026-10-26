-- Allow "photo" items for the Life log.
alter table public.portfolio_items drop constraint if exists portfolio_items_item_type_check;
alter table public.portfolio_items add constraint portfolio_items_item_type_check
  check (item_type in ('writing','project','photo','recipe','music','desk','wishlist','bookmark','gem','life-log','note','custom'));
