-- Allow "project" items so existing projects can be imported into and edited from Studio.
alter table public.portfolio_items drop constraint if exists portfolio_items_item_type_check;
alter table public.portfolio_items add constraint portfolio_items_item_type_check
  check (item_type in ('writing','project','recipe','music','desk','wishlist','bookmark','gem','life-log','note','custom'));
