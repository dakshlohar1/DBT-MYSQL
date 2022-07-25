{{ config(materialized='table') }}

with airline_data as (
    select *  from {{ source('airline_source', 'airline') }}
),

final as (
    select airlinename AS airline_name from airline_data
)

select * from final