class CreateViews < ActiveRecord::Migration[5.2]
  def change
    create_table :views do |t|
      t.bigint  :viewable_id
      t.string  :viewable_type
      t.timestamps
    end
    add_index :views, [:viewable_type, :viewable_id]
  end
end
